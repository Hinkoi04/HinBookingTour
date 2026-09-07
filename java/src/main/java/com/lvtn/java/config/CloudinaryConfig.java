package com.lvtn.java.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dlxbhq8pw",
                "api_key", "845399868248656",
                "api_secret", "b6WGgTWQ-0PfaOG5qTal4XVCXOE"
        ));
    }
}
