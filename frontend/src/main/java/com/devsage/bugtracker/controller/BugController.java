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

@CrossOrigin(origins = "http://localhost:3000")
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
        System.out.println("=== Incoming Bug Report ===");
        System.out.println("Title: " + bug.getTitle());
        System.out.println("ReportedBy ID: " + (bug.getReportedBy() != null ? bug.getReportedBy().getId() : "null"));
        System.out.println("AssignedTo ID: " + (bug.getAssignedTo() != null ? bug.getAssignedTo().getId() : "null"));

        // 🔍 Resolve reportedBy user
        if (bug.getReportedBy() != null && bug.getReportedBy().getId() != null) {
            Optional<User> reporter = userRepository.findById(bug.getReportedBy().getId());
            if (reporter.isPresent()) {
                bug.setReportedBy(reporter.get());
                System.out.println("✅ Resolved reportedBy user: " + reporter.get());
            } else {
                System.out.println("⚠️ reportedBy ID not found in DB: " + bug.getReportedBy().getId());
            }
        }

        // 🔍 Resolve assignedTo user
        if (bug.getAssignedTo() != null && bug.getAssignedTo().getId() != null) {
            Optional<User> assignee = userRepository.findById(bug.getAssignedTo().getId());
            if (assignee.isPresent()) {
                bug.setAssignedTo(assignee.get());
                System.out.println("✅ Resolved assignedTo user: " + assignee.get().getName());
            } else {
                System.out.println("⚠️ assignedTo ID not found in DB: " + bug.getAssignedTo().getId());
            }
        }

        // 🤖 AI severity prediction
       // 🤖 AI severity prediction
if (bug.getSeverity() == null) {
    try {
        Map<String, String> aiResult = aiService.predictSeverity(bug.getDescription());

        String reasoning = aiResult.get("reasoning");
        String severity = aiResult.get("predictedSeverity");

        bug.setAiReasoning(reasoning);
        bug.setSeverity(severity != null ? Bug.Severity.valueOf(severity.toUpperCase()) : Bug.Severity.MEDIUM);

        System.out.println("🔮 AI predicted severity: " + bug.getSeverity());
        System.out.println("💡 AI reasoning: " + reasoning);

    } catch (Exception e) {
        System.out.println("❌ AI severity prediction failed: " + e.getMessage());
        bug.setSeverity(Bug.Severity.MEDIUM);
    }
}


        // 🏷️ Set default status
        if (bug.getStatus() == null) {
            bug.setStatus(Bug.Status.OPEN);
        }

        bug.setCreatedAt(java.time.LocalDateTime.now());

        Bug saved = bugRepository.save(bug);
        System.out.println("✅ Bug saved with ID: " + saved.getId());

        return saved;
    }

    @GetMapping("/{id}")
    public Bug getBugById(@PathVariable Long id) {
        return bugRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Bug updateBug(@PathVariable Long id, @RequestBody Bug bug) {
        return bugRepository.findById(id).map(existing -> {
            existing.setTitle(bug.getTitle());
            existing.setDescription(bug.getDescription());
            existing.setSeverity(bug.getSeverity());
            existing.setStatus(bug.getStatus());
            existing.setAssignedTo(bug.getAssignedTo());
            existing.setUpdatedAt(java.time.LocalDateTime.now());
            return bugRepository.save(existing);
        }).orElse(null);
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
