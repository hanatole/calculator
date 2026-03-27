package com.bitnoises.calculator.model;

public class CalculatorForm {

    private Double numberA;
    private Double numberB;
    private String operation;
    private Double result;
    private String error;

    public Double getNumberA() { return numberA; }
    public void setNumberA(Double numberA) { this.numberA = numberA; }

    public Double getNumberB() { return numberB; }
    public void setNumberB(Double numberB) { this.numberB = numberB; }

    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }

    public Double getResult() { return result; }
    public void setResult(Double result) { this.result = result; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
