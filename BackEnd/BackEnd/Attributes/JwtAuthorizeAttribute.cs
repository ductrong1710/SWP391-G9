using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace BackEnd.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class JwtAuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string[] _roles;

        public JwtAuthorizeAttribute(params string[] roles)
        {
            _roles = roles;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (string.IsNullOrEmpty(token))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var jwtService = context.HttpContext.RequestServices.GetService<IJwtService>();
            if (jwtService == null)
            {
                context.Result = new StatusCodeResult(500);
                return;
            }

            var principal = jwtService.ValidateToken(token);
            if (principal == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // Kiểm tra role nếu có yêu cầu
            if (_roles.Length > 0)
            {
                var userRole = principal.FindFirst(ClaimTypes.Role)?.Value;
                if (string.IsNullOrEmpty(userRole) || !_roles.Contains(userRole))
                {
                    context.Result = new ForbidResult();
                    return;
                }
            }

            // Lưu thông tin user vào HttpContext để sử dụng trong controller
            context.HttpContext.Items["UserID"] = principal.FindFirst("UserID")?.Value;
            context.HttpContext.Items["Username"] = principal.FindFirst(ClaimTypes.Name)?.Value;
            context.HttpContext.Items["Role"] = principal.FindFirst(ClaimTypes.Role)?.Value;
        }
    }
} 