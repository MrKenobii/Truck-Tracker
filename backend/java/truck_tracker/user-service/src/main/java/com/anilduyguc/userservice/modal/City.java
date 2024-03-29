package com.anilduyguc.userservice.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "city")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class City {
    @Id
    private String id;
    private String name;
    private String longitude;
    private String latitude;
    private String population;
    private Integer urgency;
    private Integer tent;
    private Integer food;
    private Integer water;
    private Integer clothing;
    @OneToMany(mappedBy = "city", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> users;
}
