package com.semantha.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Controller
@SuppressWarnings("UnusedDeclaration")
@RequestMapping("/")
public class AppController {

    private static String getHost(HttpServletRequest request) {
        String url = request.getRequestURL().toString();
        return url.substring(0, url.lastIndexOf(request.getRequestURI()));
    }

    private final static String DEFAULT_CONTENT_TYPE = "text/html;charset=UTF-8";

    @Value("${environment}")
    private String message;


    /**
     * Default rendering based on property file values
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/", method = RequestMethod.GET, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String render(HttpServletRequest request, HttpServletResponse response) {

         return message;
    }

    /**
     * Returns the view specified
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/finder", method = RequestMethod.GET, produces = "text/html;charset=UTF-8;")
    public ModelAndView renderView(HttpServletRequest request, HttpServletResponse response) {
        return getDefaultModelAndView("finder", request, response);
    }

    private ModelAndView getDefaultModelAndView(String jspPath, HttpServletRequest request, HttpServletResponse response) {
        final Map<String, Object> model = new HashMap<String, Object>();

        model.put("host", getHost(request));

        response.setContentType(DEFAULT_CONTENT_TYPE);

        return new ModelAndView(jspPath, model);
    }

}
