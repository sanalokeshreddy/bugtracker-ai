package com.devsage.bugtracker.repository;

import com.devsage.bugtracker.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
