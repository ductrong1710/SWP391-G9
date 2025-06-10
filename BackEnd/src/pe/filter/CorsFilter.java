package pe.filter;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletResponse;

@WebFilter("/*")
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Cho phép truy cập từ bất kỳ nguồn nào (trong môi trường phát triển)
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        
        // Cho phép các phương thức HTTP
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        
        // Cho phép các header
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        // Cho phép credentials
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        
        // Thời gian cache preflight request
        httpResponse.setHeader("Access-Control-Max-Age", "3600");
        
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
