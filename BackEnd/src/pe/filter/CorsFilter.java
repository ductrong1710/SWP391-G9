package pe.filter;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebFilter("/*")
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Lấy Origin từ request
        String origin = httpRequest.getHeader("Origin");
        if (origin == null) {
            // Nếu không có Origin header, cho phép tất cả
            origin = "*";
        }
        
        // Cho phép truy cập từ nguồn cụ thể
        httpResponse.setHeader("Access-Control-Allow-Origin", origin);
        
        // Cho phép các phương thức HTTP
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        
        // Cho phép các header
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        
        // Cho phép credentials
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        
        // Thời gian cache preflight request
        httpResponse.setHeader("Access-Control-Max-Age", "3600");
        
        // Xử lý preflight request
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        // Tiếp tục chuỗi filter
        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Khởi tạo
    }

    @Override
    public void destroy() {
        // Dọn dẹp
    }
}
