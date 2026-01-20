package com.blogi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.blogi.entity.BlogPost;
import com.blogi.entity.User;

public interface BlogRepository extends JpaRepository<BlogPost, Long> {
	

    List<BlogPost> findByAuthor(User author);

   
    List<BlogPost> findByAuthorId(Long authorId);
    
    @Query("SELECT b FROM BlogPost b WHERE b.author.id = :authorId")
    List<BlogPost> findPostsByAuthorId(@Param("authorId") Long authorId);

}
