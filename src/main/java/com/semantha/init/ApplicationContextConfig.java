package com.semantha.init;

import com.semantha.IApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;

@Configuration
@ComponentScan(basePackageClasses = IApplication.class, excludeFilters = @ComponentScan.Filter({Controller.class, Configuration.class}))
public class ApplicationContextConfig {
}
