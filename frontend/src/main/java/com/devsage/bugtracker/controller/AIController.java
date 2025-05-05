package com.devsage.bugtracker.controller;

import com.devsage.bugtracker.service.AIService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/predict-severity")
    public SeverityResponse predictSeverity(@RequestBody SeverityRequest request) {
        Map<String, String> result = aiService.predictSeverity(request.getDescription());
        return new SeverityResponse(result.get("predictedSeverity"), result.get("reasoning"));
    }

    @Data
    public static class SeverityRequest {
        private String description;
    }

    @Data
    @AllArgsConstructor
    public static class SeverityResponse {
        private String predictedSeverity;
        private String reasoning;
    }
}