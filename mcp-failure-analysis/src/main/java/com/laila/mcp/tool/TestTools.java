package com.laila.mcp.tool;

import com.laila.mcp.model.TestFailure;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tools")
public class TestTools {
    @PostMapping("/detect-pattern")
    public String detectPattern(@RequestBody TestFailure failure) {

        if (failure.logs.contains("NullPointer")) {
            return "Possible null pointer issue in backend";
        }

        if (failure.logs.contains("timeout")) {
            return "Timeout detected - possible performance issue";
        }

        if (failure.statusCode == 500) {
            return "Internal server error - backend failure";
        }

        return "Unknown error pattern";
    }

    @PostMapping("/compare")
    public String compare(@RequestBody TestFailure failure) {

        if (!failure.expected.equals(failure.actual)) {
            return "Mismatch detected between expected and actual response";
        }

        return "Responses match";
    }
}