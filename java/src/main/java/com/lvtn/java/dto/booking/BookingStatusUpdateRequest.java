package com.lvtn.java.dto.booking;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatusUpdateRequest {
    @NotBlank(message = "Trạng thái không được để trống")
    private String status;
}