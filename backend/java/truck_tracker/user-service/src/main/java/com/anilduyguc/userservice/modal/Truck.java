package com.anilduyguc.userservice.modal;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "truck")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Truck {
    @Id
    private String id;
    private String licensePlate;
    private boolean isArrived;
    private boolean isEscorted;
    private String longitude;
    private String latitude;
    private String status;
    private Integer tent;
    private Integer food;
    private Integer water;
    private Integer clothing;
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
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
