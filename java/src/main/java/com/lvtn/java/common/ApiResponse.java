package com.lvtn.java.common;

import java.time.LocalDateTime;

public record ApiResponse<T>(boolean success, String message, T data, LocalDateTime timestamp) {
    public static<T> ApiResponse<T> success(String message, T data){
        return new ApiResponse<>(true, message,data,LocalDateTime.now());
    }
    public static<T> ApiResponse<T> success(T data){
        return success("success",data);
    }
    public static ApiResponse<Void>successMessage(String message){
        return success(message,null);
    }
    public static ApiResponse<Void>errorMessage(String message){
        return new ApiResponse<>(false,message,null,LocalDateTime.now());
    }
    public static <T> ApiResponse<T>errorMessage(String message, T data){
        return new ApiResponse<>(false,message,data,LocalDateTime.now());
    }
}
