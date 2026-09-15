package com.lvtn.java.dto.departure;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeparturePassengerDto {
    private Integer id;
    private Integer bookingId;
    private String bookingCode;
    private String fullName;
    private LocalDate dob;
    private String gender;
    private String identityCard;
    private String phone;
    private String passengerType; // adult, child, baby
    private String bookerName;
    private String bookerPhone;
    private String bookerEmail;
    private String bookingStatus; // pending, confirmed, completed, cancelled
    private String note;
    private LocalDateTime bookingDate;
}
