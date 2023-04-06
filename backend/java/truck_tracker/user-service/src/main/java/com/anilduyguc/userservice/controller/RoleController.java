package com.anilduyguc.userservice.controller;

import com.anilduyguc.userservice.modal.Role;
import com.anilduyguc.userservice.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/role")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<?> getRoles(@RequestParam(required = false) String name){
        if(name != null){
            return new ResponseEntity<>(roleService.getRoleByName(name), HttpStatus.OK);
        }
        else {
            return new ResponseEntity<>(roleService.getRoles(), HttpStatus.OK);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable String id){
        return new ResponseEntity<>(roleService.getRoleById(id), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role role){
        return new ResponseEntity<>(roleService.createRole(role), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable String id, @RequestBody Role role){
        return new ResponseEntity<>(roleService.updateRole(id, role), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable String id){
        roleService.deleteRole(id);
    }
}
