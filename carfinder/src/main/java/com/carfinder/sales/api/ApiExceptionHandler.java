package com.carfinder.sales.api;

import com.carfinder.sales.exceptions.BusinessRuleViolationException;
import com.carfinder.sales.exceptions.ResourceNotFoundException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.*;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
          .forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));

        return ResponseEntity.badRequest().body(Map.of(
            "message", "Validation failed.",
            "errors", fieldErrors
        ));
    }

  
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handleConstraint(ConstraintViolationException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(v -> fieldErrors.put(
            v.getPropertyPath().toString(), v.getMessage()
        ));
        return ResponseEntity.badRequest().body(Map.of(
            "message", "Validation failed.",
            "errors", fieldErrors
        ));
    }


    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleNotReadable(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(Map.of(
            "message", "Malformed request body or invalid field type."
        ));
    }


    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest().body(Map.of(
            "message", "Invalid parameter type.",
            "errors", Map.of(ex.getName(), "Expected type: " + (ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown"))
        ));
    }

    @ExceptionHandler(BusinessRuleViolationException.class)
    public ResponseEntity<?> handleBusiness(BusinessRuleViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
            "message", ex.getMessage()
        ));
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrity(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
            "message", "Data integrity violation."
        ));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
            "message", ex.getMessage()
        ));
    }


    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
            "message", "Forbidden."
        ));
    }


    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuth(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "message", "Unauthorized."
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
            "message", "Unexpected error."
        ));
    }
}

