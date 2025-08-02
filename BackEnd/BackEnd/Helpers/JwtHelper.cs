using Microsoft.AspNetCore.Http;

namespace BackEnd.Helpers
{
    public static class JwtHelper
    {
        public static string? GetCurrentUserID(this HttpContext context)
        {
            return context.Items["UserID"]?.ToString();
        }

        public static string? GetCurrentUsername(this HttpContext context)
        {
            return context.Items["Username"]?.ToString();
        }

        public static string? GetCurrentUserRole(this HttpContext context)
        {
            return context.Items["Role"]?.ToString();
        }

        public static bool IsAdmin(this HttpContext context)
        {
            return GetCurrentUserRole(context) == "Admin";
        }

        public static bool IsMedicalStaff(this HttpContext context)
        {
            return GetCurrentUserRole(context) == "MedicalStaff";
        }

        public static bool IsParent(this HttpContext context)
        {
            return GetCurrentUserRole(context) == "Parent";
        }

        public static bool IsStudent(this HttpContext context)
        {
            return GetCurrentUserRole(context) == "Student";
        }

        public static bool HasRole(this HttpContext context, params string[] roles)
        {
            var currentRole = GetCurrentUserRole(context);
            return roles.Contains(currentRole);
        }
    }
} 