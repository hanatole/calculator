package com.bitnoises.calculator.controller;

import com.bitnoises.calculator.model.CalculatorForm;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
public class CalculatorController {

    @GetMapping("/")
    public String index(Model model) {
        return "calculator";
    }
    
    @PostMapping(value = "/",
                 consumes = "application/json",
                 produces = "application/json")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> calculate(@RequestBody CalculatorForm form) {
        Map<String, Object> response = new HashMap<>();

        if (form.getNumberA() == null || form.getNumberB() == null
                || form.getOperation() == null || form.getOperation().isBlank()) {
            response.put("error", "Please fill in all fields.");
            return ResponseEntity.badRequest().body(response);
        }

        double a = form.getNumberA();
        double b = form.getNumberB();
        String op = form.getOperation();

        try {
            double rounded = getRounded(op, a, b);

            response.put("result", rounded);
            response.put("numberA", a);
            response.put("numberB", b);
            response.put("operation", op);

        } catch (ArithmeticException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("error", "Something went wrong. Please try again.");
            return ResponseEntity.internalServerError().body(response);
        }

        return ResponseEntity.ok(response);
    }

    private static double getRounded(String op, double a, double b) {
        double result = switch (op) {
            case "add"      -> a + b;
            case "subtract" -> a - b;
            case "multiply" -> a * b;
            case "divide"   -> {
                if (b == 0) throw new ArithmeticException("Division by zero is undefined.");
                yield a / b;
            }
            default -> throw new IllegalArgumentException("Unknown operation: " + op);
        };

        return Math.round(result * 100_000_000.0) / 100_000_000.0;
    }
}
