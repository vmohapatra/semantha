package com.sphinx.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

/**
 * Bean init for reading from property files in classpath
 */
@Configuration
@SuppressWarnings("UnusedDeclaration")
public class PropertySourcesConfig {

    private static final Resource[] DEV_PROPERTIES = new ClassPathResource[]{
            new ClassPathResource("dev.properties"),
    };
    private static final Resource[] TEST_PROPERTIES = new ClassPathResource[]{
            new ClassPathResource("test.properties"),
    };
    private static final Resource[] PROD_PROPERTIES = new ClassPathResource[]{
            new ClassPathResource("prod.properties"),
    };

    @Profile("dev")
    @SuppressWarnings("UnusedDeclaration")
    public static class DevConfig {
        @Bean
        public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
            PropertySourcesPlaceholderConfigurer pspc = new PropertySourcesPlaceholderConfigurer();
            pspc.setLocations(DEV_PROPERTIES);
            return pspc;
        }
    }

    @Profile("test")
    @SuppressWarnings("UnusedDeclaration")
    public static class TestConfig {
        @Bean
        public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
            PropertySourcesPlaceholderConfigurer pspc = new PropertySourcesPlaceholderConfigurer();
            pspc.setLocations(TEST_PROPERTIES);
            return pspc;
        }
    }

    @Profile("prod")
    @SuppressWarnings("UnusedDeclaration")
    public static class ProdConfig {
        @Bean
        public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
            PropertySourcesPlaceholderConfigurer pspc = new PropertySourcesPlaceholderConfigurer();
            pspc.setLocations(PROD_PROPERTIES);
            return pspc;
        }
    }

}
