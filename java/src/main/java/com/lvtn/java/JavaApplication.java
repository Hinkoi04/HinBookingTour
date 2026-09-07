package com.lvtn.java;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class JavaApplication {

    public static void main(String[] args) {
        SpringApplication.run(JavaApplication.class, args);
    }

}
