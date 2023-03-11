package com.anilduyguc.userservice.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "truck")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Truck {
    @Id
    private String id;
    private String licensePlate;
    private String content;
    private boolean isArrived;
    private boolean isEscorted;
    private String longitude;
    private String latitude;
    private String status;
    @ManyToOne(cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE,
            CascadeType.DETACH,
            CascadeType.REFRESH
    })
    @JoinColumn(name = "from_city_id")
    private City fromCity;
    @ManyToOne(cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE,
            CascadeType.DETACH,
            CascadeType.REFRESH
    })
    @JoinColumn(name = "destination_city_id")
    private City destinationCity;
}
