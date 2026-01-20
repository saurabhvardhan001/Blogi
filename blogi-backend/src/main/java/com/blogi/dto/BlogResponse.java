package com.blogi.dto;

import java.util.List;

public class BlogResponse {
    private Long id;
    private String title;
    private String content;
    private String metaTitle;
    private String metaDescription;
    private List<String> keywords;
    private int readabilityScore;
    private double seoScore;
    private double plagiarismScore;

    public BlogResponse() {}
    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getMetaTitle() { return metaTitle; }
    public void setMetaTitle(String metaTitle) { this.metaTitle = metaTitle; }
    public String getMetaDescription() { return metaDescription; }
    public void setMetaDescription(String metaDescription) { this.metaDescription = metaDescription; }
    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }
    public int getReadabilityScore() { return readabilityScore; }
    public void setReadabilityScore(int readabilityScore) { this.readabilityScore = readabilityScore; }
    public double getSeoScore() { return seoScore; }
    public void setSeoScore(double seoScore) { this.seoScore = seoScore; }
    public double getPlagiarismScore() { return plagiarismScore; }
    public void setPlagiarismScore(double plagiarismScore) { this.plagiarismScore = plagiarismScore; }
}
