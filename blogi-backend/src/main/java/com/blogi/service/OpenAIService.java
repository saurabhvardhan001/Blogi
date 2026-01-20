package com.blogi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    private final WebClient webClient;

    @Value("${azure.openai.endpoint}")
    private String endpoint;

    @Value("${azure.openai.deployment}")
    private String deployment;

    @Value("${azure.openai.api-version}")
    private String apiVersion;

    public OpenAIService(@Value("${azure.openai.key}") String apiKey) {
        this.webClient = WebClient.builder()
                .defaultHeader("api-key", apiKey)
                .build();
    }

    public String generateBlog(String prompt) {
        String url = String.format(
                "%s/openai/deployments/%s/chat/completions?api-version=%s",
                endpoint, deployment, apiVersion
        );

        // Build request body
        Map<String, Object> body = new HashMap<>();
        body.put("messages", List.of(
                Map.of(
                        "role", "system",
                        "content", "You are Blogi, an SEO-focused blog writer. Use markdown headings, subheadings, bullet lists, and include an engaging introduction and conclusion."
                ),
                Map.of(
                        "role", "user",
                        "content", prompt
                )
        ));
        body.put("temperature", 0.7);
        body.put("max_tokens", 1200);
        body.put("top_p", 0.95);
        body.put("stream", false);

        // NOTE: bodyToMono(Map.class) returns a raw Map; cast is localized and checked downstream.
        @SuppressWarnings("unchecked")
        Map<String, Object> response = this.webClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .onErrorResume(e -> Mono.just(Map.of()))
                .block();

        if (response == null || response.isEmpty()) {
            return "";
        }

        try {
            List<Map<String, Object>> choices = getListOfMap(response, "choices");
            if (choices == null || choices.isEmpty()) {
                return "";
            }

            Map<String, Object> first = choices.get(0);
            Map<String, Object> message = getMap(first, "message");
            if (message == null) {
                return "";
            }

            Object content = message.get("content");
            return (content instanceof String) ? (String) content : "";
        } catch (Exception ex) {
            // You may want to log this exception
            return "";
        }
    }

    // ---------------- Helper methods (Java 8+/11/17 compatible) ----------------

    @SuppressWarnings("unchecked")
    private Map<String, Object> getMap(Map<String, Object> source, String key) {
        Object val = source.get(key);
        if (val instanceof Map) {
            return (Map<String, Object>) val;
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> getListOfMap(Map<String, Object> source, String key) {
        Object val = source.get(key);
        if (val instanceof List) {
            // We assume JSON array -> List of Map<String, Object> (as produced by Jackson)
            return (List<Map<String, Object>>) val;
        }
        return null;
    }
}