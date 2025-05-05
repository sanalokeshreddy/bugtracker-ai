package com.devsage.bugtracker.controller;

import com.devsage.bugtracker.model.Bug;
import com.devsage.bugtracker.model.Comment;
import com.devsage.bugtracker.model.User;
import com.devsage.bugtracker.repository.BugRepository;
import com.devsage.bugtracker.repository.CommentRepository;
import com.devsage.bugtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bugs/{bugId}/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Comment addComment(@PathVariable Long bugId, @RequestBody Comment comment) {
        Bug bug = bugRepository.findById(bugId).orElseThrow();
        User user = userRepository.findById(comment.getUser().getId()).orElseThrow();

        comment.setBug(bug);
        comment.setUser(user);
        return commentRepository.save(comment);
    }

    @GetMapping
    public List<Comment> getCommentsForBug(@PathVariable Long bugId) {
        Bug bug = bugRepository.findById(bugId).orElseThrow();
        return bug.getComments(); // Or query comments by bugId if needed
    }
}
