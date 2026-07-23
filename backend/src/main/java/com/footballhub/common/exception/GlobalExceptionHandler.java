package com.footballhub.common.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.footballhub.common.error.ApiError;
import com.footballhub.common.error.ErrorCode;
import com.footballhub.common.response.ApiResponse;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException exception) {
		ErrorCode errorCode = exception.getErrorCode();
		return errorResponse(errorCode, exception.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValidException(
			MethodArgumentNotValidException exception) {
		String message = exception.getBindingResult().getAllErrors().stream()
				.findFirst()
				.map(ObjectError::getDefaultMessage)
				.orElse(ErrorCode.INVALID_REQUEST.getMessage());
		return errorResponse(ErrorCode.INVALID_REQUEST, message);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiResponse<Void>> handleConstraintViolationException(
			ConstraintViolationException exception) {
		String message = exception.getConstraintViolations().stream()
				.findFirst()
				.map(violation -> violation.getMessage())
				.orElse(ErrorCode.INVALID_REQUEST.getMessage());
		return errorResponse(ErrorCode.INVALID_REQUEST, message);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadableException(
			HttpMessageNotReadableException exception) {
		return errorResponse(ErrorCode.INVALID_REQUEST, ErrorCode.INVALID_REQUEST.getMessage());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Void>> handleException(Exception exception) {
		log.error("Unexpected server error", exception);
		return errorResponse(
				ErrorCode.INTERNAL_SERVER_ERROR,
				ErrorCode.INTERNAL_SERVER_ERROR.getMessage());
	}

	private ResponseEntity<ApiResponse<Void>> errorResponse(ErrorCode errorCode, String message) {
		ApiError error = new ApiError(errorCode.getCode(), message);
		return ResponseEntity.status(errorCode.getHttpStatus()).body(ApiResponse.failure(error));
	}
}
