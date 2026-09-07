package com.lvtn.java.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassengerResponse {
    private Integer id;
    private String fullName;
    private LocalDate dob;
    private String gender;
    private String identityCard;
    private String phone;
    private String passengerType;
}