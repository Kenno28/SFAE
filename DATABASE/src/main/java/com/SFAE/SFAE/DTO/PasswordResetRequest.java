package com.SFAE.SFAE.DTO;

import lombok.Data;

@Data
public class PasswordResetRequest {
    private String token;
    private String password;
}
