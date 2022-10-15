using Backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SqlInjectionController : ControllerBase
    {
        private readonly DataContext _context;

        public SqlInjectionController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("unsafe/{username}/{password}")]
        public IEnumerable<User> Get(string username, string password)
        {
            return _context.Users.FromSqlRaw
                ($"SELECT * FROM Users WHERE Username='{username}' AND Password='{password}'")
                .ToList();
        }

        [HttpGet("interpolated/{username}/{password}")]
        public IEnumerable<User> GetInterpolated(string username, string password)
        {
            var query = _context.Users.FromSqlInterpolated
                ($"SELECT * FROM Users WHERE Username={username} AND Password={password}");
            var querystring = query.ToQueryString();
            return query.ToList();
        }

        [HttpGet("orm/{username}/{password}")]
        public IEnumerable<User> GetWithOrm(string username, string password)
        {
            var query = _context.Users.Where(user => user.Username == username && user.Password == password);
            var queryString = query.ToQueryString();
            return query.ToList();
        }
    }
}