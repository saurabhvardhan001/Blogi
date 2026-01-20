package com.blogi.dto;

import java.util.List;
import jakarta.validation.constraints.*;

public class GenerateRequest {
    @NotBlank
    private String topic;
    private List<String> keywords;
    private String tone; // formal, casual, persuasive
    private String targetAudience; // beginners, experts, etc.
    private int length; // in words approx

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }
    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }
    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }
    public int getLength() { return length; }
    public void setLength(int length) { this.length = length; }
}
