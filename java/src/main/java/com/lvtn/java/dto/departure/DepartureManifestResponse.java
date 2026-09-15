package com.lvtn.java.dto.departure;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartureManifestResponse {
    private DepartureResponse departure;
    private List<DeparturePassengerDto> passengers;
    private int totalPassengers;
    private int totalAdults;
    private int totalChildren;
    private int totalBabies;
    private int totalBookings;
    private int confirmedBookings;
}
