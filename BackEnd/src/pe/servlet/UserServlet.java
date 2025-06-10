package pe.servlet;

import pe.dao.UserDAO;
import pe.entity.User;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/users")
public class UserServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        String action = request.getParameter("action");
        
        try {
            if ("getAll".equals(action)) {
                List<User> users = userDAO.getAllUsers();
                out.print(gson.toJson(users));
                
            } else if ("getById".equals(action)) {
                int userId = Integer.parseInt(request.getParameter("id"));
                User user = userDAO.getUserById(userId);
                if (user != null) {
                    out.print(gson.toJson(user));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\":\"User not found\"}");
                }
                
            } else if ("getByType".equals(action)) {
                String userType = request.getParameter("type");
                List<User> users = userDAO.getUsersByType(userType);
                out.print(gson.toJson(users));
                
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\":\"Invalid action\"}");
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        String action = request.getParameter("action");
        
        try {
            if ("register".equals(action)) {
                // Check if user is authenticated and has proper role
                HttpSession session = request.getSession(false);
                if (session == null || session.getAttribute("user") == null) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    out.print("{\"error\":\"You must be logged in to register new users\"}");
                    return;
                }
                
                User currentUser = (User) session.getAttribute("user");
                String userType = currentUser.getUserType();
                
                // Only admin and medical staff can register new users
                if (!("admin".equals(userType) || "medical".equals(userType))) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    out.print("{\"error\":\"Only administrators and medical staff can register new users\"}");
                    return;
                }
                
                // Get form parameters
                String username = request.getParameter("username");
                String password = request.getParameter("password");
                String firstName = request.getParameter("firstName");
                String lastName = request.getParameter("lastName");
                String email = request.getParameter("email");
                String phone = request.getParameter("phone");
                String newUserType = request.getParameter("userType");
                
                // Only allow creating parent and student accounts
                if (!("parent".equals(newUserType) || "student".equals(newUserType))) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    out.print("{\"error\":\"You can only register parent and student accounts\"}");
                    return;
                }
                
                // Check if username already exists
                if (userDAO.getUserByUsername(username) != null) {
                    response.setStatus(HttpServletResponse.SC_CONFLICT);
                    out.print("{\"error\":\"Username already exists\"}");
                    return;
                }
                
                // Create new user
                User newUser = new User(username, password, firstName, lastName, email, phone, newUserType);
                boolean success = userDAO.createUser(newUser);
                
                if (success) {
                    response.setStatus(HttpServletResponse.SC_CREATED);
                    out.print("{\"message\":\"User registered successfully\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print("{\"error\":\"Failed to register user\"}");
                }
                
            } else if ("login".equals(action)) {
                String username = request.getParameter("username");
                String password = request.getParameter("password");
                
                User user = userDAO.authenticateUser(username, password);
                
                if (user != null) {
                    // Create session
                    HttpSession session = request.getSession();
                    session.setAttribute("user", user);
                    session.setMaxInactiveInterval(30 * 60); // 30 minutes
                    
                    Map<String, Object> responseData = new HashMap<>();
                    responseData.put("message", "Login successful");
                    responseData.put("user", user);
                    out.print(gson.toJson(responseData));
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    out.print("{\"error\":\"Invalid username or password\"}");
                }
                
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\":\"Invalid action\"}");
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            int userId = Integer.parseInt(request.getParameter("id"));
            String firstName = request.getParameter("firstName");
            String lastName = request.getParameter("lastName");
            String email = request.getParameter("email");
            String phone = request.getParameter("phone");
            String userType = request.getParameter("userType");
            
            User user = userDAO.getUserById(userId);
            if (user == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"error\":\"User not found\"}");
                return;
            }
            
            // Update user fields
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setPhone(phone);
            user.setUserType(userType);
            
            boolean success = userDAO.updateUser(user);
            
            if (success) {
                out.print("{\"message\":\"User updated successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to update user\"}");
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            int userId = Integer.parseInt(request.getParameter("id"));
            
            boolean success = userDAO.deleteUser(userId);
            
            if (success) {
                out.print("{\"message\":\"User deleted successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to delete user\"}");
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }
}
