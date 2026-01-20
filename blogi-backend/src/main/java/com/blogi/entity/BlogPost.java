package com.blogi.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "blog_posts")
public class BlogPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private String metaTitle;
    @Column(length = 500)
    private String metaDescription;

    @ElementCollection
    @CollectionTable(name = "blog_keywords", joinColumns = @JoinColumn(name = "blog_id"))
    @Column(name = "keyword")
    private List<String> keywords = new ArrayList<>();

    private int readabilityScore;
    private double seoScore;
    private double plagiarismScore;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    private User author;

    public BlogPost() {}

    @PrePersist
    public void onCreate() { this.createdAt = LocalDateTime.now(); this.updatedAt = LocalDateTime.now(); }

    @PreUpdate
    public void onUpdate() { this.updatedAt = LocalDateTime.now(); }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
}
