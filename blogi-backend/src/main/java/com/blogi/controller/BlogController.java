package com.blogi.controller;

import com.blogi.dto.BlogResponse;
import com.blogi.dto.GenerateRequest;
import com.blogi.entity.BlogPost;
import com.blogi.entity.User;
import com.blogi.exception.NotFoundException;
import com.blogi.repository.BlogRepository;
import com.blogi.repository.UserRepository;
import com.blogi.security.JwtService;
import com.blogi.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/blog")
@CrossOrigin // allow calls from your frontend (http://localhost:5173)
public class BlogController {

    private final BlogService blogService;
    private final BlogRepository blogRepository;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public BlogController(BlogService blogService, BlogRepository blogRepository, JwtService jwtService, UserRepository userRepository) {
        this.blogService = blogService;
        this.blogRepository = blogRepository;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/generate")
    public ResponseEntity<BlogResponse> generate(@Valid @RequestBody GenerateRequest req,
                                                 Authentication auth) {
        String username = (auth != null) ? auth.getName() : "anonymous";
        BlogPost saved = blogService.generateAndSave(req, username);
        return ResponseEntity.ok(toDto(saved));
    }

    @GetMapping
    public List<BlogResponse> list(@RequestHeader(value = "Authorization", required = true) String jwt) {
        Optional<User> user = userRepository.findByUsername(jwtService.extractUsername(jwt.substring(7)));
        if(user.isPresent()) {
        	return blogRepository.findPostsByAuthorId(user.get().getId()).stream().map(this::toDto).toList();
        }
    	return null;
    }

    @GetMapping("/{id}")
    public BlogResponse get(@PathVariable Long id) {
        BlogPost p = blogRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Blog not found"));
        return toDto(p);
    }

    private BlogResponse toDto(BlogPost p) {
        BlogResponse r = new BlogResponse();
        r.setId(p.getId());
        r.setTitle(p.getTitle());
        r.setContent(p.getContent());
        r.setMetaTitle(p.getMetaTitle());
        r.setMetaDescription(p.getMetaDescription());
        r.setKeywords(p.getKeywords());
        r.setReadabilityScore(p.getReadabilityScore());
        r.setSeoScore(p.getSeoScore());
        r.setPlagiarismScore(p.getPlagiarismScore());
        return r;
    }
}
