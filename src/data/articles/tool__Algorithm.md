# 快速幂（logn）

LL fast_pow(LL base, LL exp, int mod) {

    LL result = 1;

    base %= mod;

    while (exp > 0) {

        if (exp % 2 == 1) {

            result = (result * base) % mod;  

        }

        base = (base * base) % mod;  

        exp /= 2;  

    }

    return result;

}
# string to int or long long or float or double or long long double with unsigned
stoi
stol
stoul
stoll
stoull
stof
stod
stold
# 大写转换 transform 遍历迭代

transform(s.begin(),s.end(),s.begin(),::toupper);

