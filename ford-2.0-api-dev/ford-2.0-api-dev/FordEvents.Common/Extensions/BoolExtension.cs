
namespace System
{
    public static class BoolExtension
    {
        public static bool AsBool(this bool? param)
        {
            return param.HasValue ? param.Value : false;
        }
    }
}
