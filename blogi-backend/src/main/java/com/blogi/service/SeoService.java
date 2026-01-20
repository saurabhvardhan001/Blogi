package com.blogi.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SeoService {

    public int readabilityScore(String content) {
        // Very naive readability score: shorter sentences => higher score
        String[] sentences = content.split("[.!?]");
        double avgLen = Arrays.stream(sentences)
                .filter(s -> !s.isBlank())
                .mapToInt(s -> s.trim().split("\\s+").length) // FIX: \\s+
                .average()
                .orElse(20);
        int score = (int) Math.max(0, Math.min(100, 100 - (avgLen - 12) * 3));
        return score;
    }

    public double seoScore(String title, List<String> keywords, String content) {
        double kd = 0.0;
        for (String k : keywords) {
            int count = content.toLowerCase().split(k.toLowerCase(), -1).length - 1;
            kd += Math.min(2.0, count / 5.0);
        }
        kd = Math.min(1.0, kd);
        double titleScore = Math.min(1.0, title.length() / 60.0);
        return Math.round((0.6 * kd + 0.4 * titleScore) * 100.0) / 100.0;
    }

    public String metaDescription(String content) {
        // FIX: escape dash and use \\s+
        String plain = content.replaceAll("[#*>`\\-]", "")
                              .replaceAll("\\s+", " ")
                              .trim();
        return plain.length() > 155 ? plain.substring(0, 152) + "..." : plain;
    }
}