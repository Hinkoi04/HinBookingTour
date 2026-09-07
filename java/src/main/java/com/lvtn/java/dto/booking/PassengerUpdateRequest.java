package com.lvtn.java.dto.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassengerUpdateRequest {

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @Past(message = "Ngày sinh phải ở quá khứ")
    private LocalDate dob;

    private String gender;

    private String identityCard;

    private String phone;

    @NotBlank(message = "Loại hành khách không được để trống")
    private String passengerType;
}