package com.laila.mcp.prompt;

import com.laila.mcp.model.TestFailure;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/prompts")
public class PromptController {

    @PostMapping("/suggest-fix")
    public String suggestFix(@RequestBody TestFailure failure) {

        return """
                You are a backend QA specialist.

                Based on the failure below:

                Test ID: %s
                Logs: %s
                Status Code: %d

                Suggest:
                1. A possible fix in the backend
                2. A possible improvement in the test
                3. Any missing validation

                Be specific and technical.
                """.formatted(
                failure.testId,
                failure.logs,
                failure.statusCode
        );
    }

    @PostMapping("/analyze")
    public String analyze(@RequestBody TestFailure failure) {

        return """
                You are a senior QA engineer.

                Analyze the following test failure:

                Test ID: %s
                Expected: %s
                Actual: %s
                Status Code: %d
                Logs: %s

                Tasks:
                1. Identify the root cause
                2. Classify the issue (bug, flaky test, environment issue)
                3. Explain your reasoning clearly
                """.formatted(
                failure.testId,
                failure.expected,
                failure.actual,
                failure.statusCode,
                failure.logs
        );
    }
}