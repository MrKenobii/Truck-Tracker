package com.anilduyguc.userservice.modal;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "notification")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Notification {
    @Id
    private String id;
    private String content;
    private Integer emergencyLevel;
    @ManyToOne(cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE,
            CascadeType.DETACH,
            CascadeType.REFRESH
    })
    @JoinColumn(name = "user_id")
    private User user;
}
