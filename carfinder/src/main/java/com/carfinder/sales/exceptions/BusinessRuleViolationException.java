package com.carfinder.sales.exceptions;

public class BusinessRuleViolationException extends RuntimeException {
    public BusinessRuleViolationException(String message) { super(message); }
}
