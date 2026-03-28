package com.laila.mcp.resource;

import com.laila.mcp.model.TestFailure;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/resources")
public class TestResource {

    @GetMapping("/latest-failure")
    public TestFailure getLatestFailure() {

        TestFailure failure = new TestFailure();
        failure.testId = "TC_01";
        failure.expected = "200 OK";
        failure.actual = "500 INTERNAL SERVER ERROR";
        failure.logs = "NullPointerException at service layer";
        failure.statusCode = 500;

        return failure;
    }

    @GetMapping("/logs/{testId}")
    public String getLogs(@PathVariable String testId) {
        return "Logs for " + testId + ": timeout on downstream service";
    }
}