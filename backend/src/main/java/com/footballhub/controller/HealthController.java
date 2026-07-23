package com.footballhub.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.footballhub.common.response.ApiResponse;

@RestController
@RequestMapping("/api")
public class HealthController {

	@GetMapping("/health")
	public ApiResponse<Map<String, String>> health() {
		Map<String, String> health = Map.of(
				"status", "UP",
				"service", "football-hub-backend");
		return ApiResponse.success(health);
	}
}
