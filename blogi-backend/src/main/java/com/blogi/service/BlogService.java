package com.blogi.service;

import com.blogi.dto.GenerateRequest;
import com.blogi.entity.BlogPost;
import com.blogi.entity.User;
import com.blogi.repository.BlogRepository;
import com.blogi.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogService {
    private final OpenAIService openAIService;
    private final SeoService seoService;
    private final PlagiarismService plagiarismService;
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    public BlogService(OpenAIService openAIService,
                       SeoService seoService,
                       PlagiarismService plagiarismService,
                       BlogRepository blogRepository, UserRepository userRepository) {
        this.openAIService = openAIService;
        this.seoService = seoService;
        this.plagiarismService = plagiarismService;
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    public BlogPost generateAndSave(GenerateRequest req, String username) {
        String prompt = buildPrompt(req);
        String content = openAIService.generateBlog(prompt);
        if (content == null || content.isBlank()) {
            content = "# Draft could not be generated. Please tweak your prompt.";
        }

        BlogPost post = new BlogPost();
        String title = deriveTitle(content, req.getTopic());
        post.setTitle(title);
        post.setContent(content);
        post.setMetaTitle(title.length() > 60 ? title.substring(0, 57) + "..." : title);
        post.setMetaDescription(seoService.metaDescription(content));
        post.setKeywords(req.getKeywords() == null ? List.of() : req.getKeywords());
        post.setReadabilityScore(seoService.readabilityScore(content));
        post.setSeoScore(seoService.seoScore(title, post.getKeywords(), content));
        post.setPlagiarismScore(plagiarismService.score(content));
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
            post.setAuthor(author);
        return blogRepository.save(post);
    }

    private String deriveTitle(String content, String fallback) {
        for (String line : content.split("\n")) {
            String l = line.trim();
            if (l.startsWith("# ")) {
                return l.substring(2).trim();
            }
        }
        return fallback;
    }

    private String buildPrompt(GenerateRequest req) {
        StringBuilder sb = new StringBuilder();
        sb.append("Topic: ").append(req.getTopic()).append("\n");
        if (req.getKeywords() != null && !req.getKeywords().isEmpty()) {
            sb.append("Keywords: ").append(String.join(", ", req.getKeywords())).append("\n");
        }
        if (req.getTone() != null) {
            sb.append("Tone: ").append(req.getTone()).append("\n");
        }
        if (req.getTargetAudience() != null) {
            sb.append("Audience: ").append(req.getTargetAudience()).append("\n");
        }
        if (req.getLength() > 0) {
            sb.append("Target length: ").append(req.getLength()).append(" words\n");
        }

        sb.append("\n")
          .append("Please produce a high-quality, SEO-optimized blog post in Markdown with:\n")
          .append("- Clear H1 title\n")
          .append("- Table of contents if long\n")
          .append("- H2/H3 sections\n")
          .append("- Bulleted lists and examples\n")
          .append("- Meta title and description suggestions at the end under a heading 'SEO Meta'\n")
          .append("- Call-to-action in the conclusion\n");

        return sb.toString();
    }
}