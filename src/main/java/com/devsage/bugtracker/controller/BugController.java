// Trigger redeploy
package com.devsage.bugtracker.controller;

import com.devsage.bugtracker.model.Bug;
import com.devsage.bugtracker.model.User;
import com.devsage.bugtracker.repository.BugRepository;
import com.devsage.bugtracker.repository.UserRepository;
import com.devsage.bugtracker.service.AIService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/bugs")
public class BugController {

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AIService aiService;

    @GetMapping
    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    @PostMapping
    public Bug createBug(@RequestBody Bug bug) {
        // If severity is not provided, use AI to predict it
        if (bug.getSeverity() == null) {
            Map<String, String> aiResult = aiService.predictSeverity(bug.getDescription());
            try {
                String severityString = aiResult.get("predictedSeverity");
                Bug.Severity severity = Bug.Severity.valueOf(severityString.toUpperCase());
                bug.setSeverity(severity);
            } catch (IllegalArgumentException e) {
                // If AI gives invalid severity, default to MEDIUM
                bug.setSeverity(Bug.Severity.MEDIUM);
            }
        }

        // Set default status if missing
        if (bug.getStatus() == null) {
            bug.setStatus(Bug.Status.OPEN);
        }

        // Set default timestamps
        bug.setCreatedAt(java.time.LocalDateTime.now());

        return bugRepository.save(bug);
    }

    @GetMapping("/{id}")
    public Bug getBugById(@PathVariable Long id) {
        return bugRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Bug updateBug(@PathVariable Long id, @RequestBody Bug bug) {
        Optional<Bug> existing = bugRepository.findById(id);
        if (existing.isPresent()) {
            Bug old = existing.get();
            old.setTitle(bug.getTitle());
            old.setDescription(bug.getDescription());
            old.setSeverity(bug.getSeverity());
            old.setStatus(bug.getStatus());
            old.setAssignedTo(bug.getAssignedTo());
            old.setUpdatedAt(java.time.LocalDateTime.now());
            return bugRepository.save(old);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteBug(@PathVariable Long id) {
        bugRepository.deleteById(id);
    }
    @PutMapping("/{id}/status")
public Bug updateStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
    Bug bug = bugRepository.findById(id).orElseThrow();
    bug.setStatus(Bug.Status.valueOf(request.getStatus()));
    return bugRepository.save(bug);
}

public static class StatusRequest {
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
}
