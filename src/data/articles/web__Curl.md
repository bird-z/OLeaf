好的！以下是一份**结构清晰、实用性强的 `curl` 使用笔记**，涵盖了从基础到进阶的核心用法，并附有真实场景示例，方便你快速查阅和使用。

---

### 📝 **Curl 使用笔记**

#### 一、基础概念
- **作用**：命令行工具，用于通过 URL 语法传输数据（支持 HTTP/HTTPS/FTP 等 20+ 协议）。
- **核心优势**：轻量、无依赖、脚本友好、支持精细控制。
- **默认行为**：发送 **GET 请求**，并将响应体输出到终端。

---

#### 二、常用选项速查表

| **类别**   | **选项**                           | **说明**                                              | **示例**                                         |
| -------- | -------------------------------- | --------------------------------------------------- | ---------------------------------------------- |
| **请求方法** | `-X`, `--request`                | 指定 HTTP 方法 (GET/POST/PUT/DELETE)                    | `curl -X POST https://api.com/data`            |
| **数据传输** | `-d`, `--data`                   | 发送 POST 数据 (默认 `application/x-www-form-urlencoded`) | `curl -d "user=admin" https://api.com/login`   |
|          | `-H`, `--header`                 | 添加自定义请求头                                            | `curl -H "Content-Type: application/json" ...` |
| **文件操作** | `-o`, `--output`                 | 将响应保存到指定文件                                          | `curl -o page.html https://example.com`        |
|          | `-O`, `--remote-name`            | 以远程文件名保存                                            | `curl -O https://example.com/file.zip`         |
|          | `-T`, `--upload-file`            | 上传文件 (通常配合 PUT)                                     | `curl -T local.txt https://example.com/upload` |
| **认证**   | `-u`, `--user`                   | HTTP Basic Auth                                     | `curl -u user:pass https://api.com/secure`     |
|          | `-H "Authorization: Bearer ..."` | Token 认证                                            | `curl -H "Authorization: Bearer abc123" ...`   |
| **调试**   | `-v`, `--verbose`                | 显示详细请求/响应过程（含头信息）                                   | `curl -v https://example.com`                  |
|          | `-I`, `--head`                   | 仅获取响应头（HEAD 请求）                                     | `curl -I https://example.com`                  |
| **网络控制** | `-L`, `--location`               | 跟随重定向                                               | `curl -L https://bit.ly/short-url`             |
|          | `-m`, `--max-time`               | 设置超时时间（秒）                                           | `curl -m 10 https://slow-api.com`              |
|          | `-x`, `--proxy`                  | 使用代理                                                | `curl -x http://proxy:8080 https://target.com` |
| **安全**   | `-k`, `--insecure`               | 忽略 SSL 证书验证（**仅测试！**）                               | `curl -k https://self-signed.badssl.com`       |

---

#### 三、高频场景实战

##### 1. **API 测试（JSON）**
```bash
# POST JSON 数据
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}' \
  https://api.example.com/users

# 带 Token 的 GET 请求
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://api.example.com/profile
```

##### 2. **文件下载与管理**
```bash
# 断点续传（中断后继续下载）
curl -C - -O https://example.com/large-file.iso

# 限速下载（避免占满带宽）
curl --limit-rate 1M -O https://example.com/big-video.mp4

# 静默下载（脚本中不显示进度条）
curl -s -O https://example.com/script.sh
```

##### 3. **调试与诊断**
```bash
# 检查网站状态码
curl -s -o /dev/null -w "%{http_code}\n" https://example.com

# 查看完整请求/响应（含 SSL 握手）
curl -v https://example.com

# 测试重定向链
curl -L -v https://httpbin.org/redirect/3
```

##### 4. **高级技巧**
```bash
# 从文件读取请求体
curl -d @payload.json https://api.com/endpoint

# 多文件上传（表单格式）
curl -F "avatar=@photo.jpg" -F "bio=Hello" https://api.com/upload

# 并发下载多个文件
curl -O https://site.com/file1.zip -O https://site.com/file2.zip
```

---

#### 四、安全与最佳实践
1. **敏感信息保护**：
   - 避免在命令行中直接写密码/Token（会留在历史记录）。
   - 使用 `-H @headers.txt` 从文件读取认证头。
2. **生产环境禁用 `-k`**：
   - 应通过 `--cacert` 指定可信 CA 证书，而非跳过验证。
3. **错误处理**：
   - 在脚本中结合 `-f`（失败时返回非0状态码）：
     ```bash
     curl -f https://api.com/test || echo "Request failed!"
     ```

---

#### 五、附录：常见问题
- **Q：如何发送 PUT/DELETE 请求？**  
  A：`curl -X PUT -d "data" URL` 或 `curl -X DELETE URL`
- **Q：如何保存 Cookie 并复用？**  
  A：  
  ```bash
  # 保存 Cookie
  curl -c cookies.txt https://login.com
  # 使用 Cookie
  curl -b cookies.txt https://profile.com
  ```
- **Q：如何模拟浏览器访问？**  
  A：添加 User-Agent 和 Referer 头：
  ```bash
  curl -H "User-Agent: Mozilla/5.0 ..." \
       -H "Referer: https://google.com" \
       https://target-site.com
  ```

---

> 💡 **提示**：善用 `curl --help` 查看完整选项，或通过 `man curl` 阅读手册。  
> 这份笔记覆盖了 90% 的日常使用场景，建议收藏备用！