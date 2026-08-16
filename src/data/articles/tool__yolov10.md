# conda env

Conda 是一个开源的包管理系统和环境管理系统，用于安装多个版本的软件包及其依赖关系，并在它们之间轻松切换。它是数据科学和机器学习领域的标准工具之一。

## 一、Conda 基础知识

### 1. 安装 Conda
- **Anaconda**：完整版，包含大量预装的数据科学包（约3GB）
- **Miniconda**：轻量版，只包含conda、Python和少量必需包（约400MB）
- 下载地址：https://www.anaconda.com/download 或 https://docs.conda.io/en/latest/miniconda.html

### 2. 初始化 Conda
安装后，打开终端（Windows使用Anaconda Prompt）：
```bash
conda init
```
重启终端使配置生效。

## 二、环境管理

### 1. 查看环境
```bash
# 列出所有环境
conda env list
# 或
conda info --envs
```

### 2. 创建环境
```bash
# 创建指定Python版本的环境
conda create --name myenv python=3.9

# 从yml文件创建环境
conda env create -f environment.yml
```

### 3. 激活/退出环境
```bash
# Windows
conda activate myenv
conda deactivate

# Linux/Mac
source conda activate myenv
source conda deactivate
```

### 4. 删除环境
```bash
conda env remove --name myenv
# 或
conda remove --name myenv --all
```

### 5. 导出/导入环境
```bash
# 导出环境配置
conda env export > environment.yml

# 从文件创建环境
conda env create -f environment.yml

# 仅导出pip安装的包
pip freeze > requirements.txt
```

## 三、包管理

### 1. 查找包
```bash
conda search numpy
```

### 2. 安装包
```bash
# 在当前环境安装
conda install numpy

# 指定版本安装
conda install numpy=1.21.0

# 指定通道安装
conda install -c conda-forge numpy
```

### 3. 更新包
```bash
conda update numpy
conda update --all  # 更新所有包
```

### 4. 删除包
```bash
conda remove numpy
```

### 5. 列出已安装包
```bash
conda list
```

## 四、高级用法

### 1. 频道(Channel)管理
```bash
# 添加频道（优先级从高到低）
conda config --add channels conda-forge
conda config --add channels defaults

# 查看频道配置
conda config --get channels

# 删除频道
conda config --remove channels conda-forge
```

### 2. 解决环境冲突
```bash
# 当环境出现依赖冲突时
conda update --all
conda install --freeze-installed package_name  # 保持其他包不变
```

### 3. 清理缓存
```bash
conda clean --all  # 清理下载的包和缓存
```

### 4. 指定Python环境运行脚本
```bash
conda run -n myenv python myscript.py
```

## 五、常见问题解决

### 1. Conda命令找不到
- 重新初始化：`conda init`
- 重启终端
- 检查PATH环境变量

### 2. 环境创建/包安装慢
- 更换国内镜像源：
```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --set show_channel_urls yes
```

### 3. 解决依赖冲突
- 创建新环境专门用于特定项目
- 使用`conda env export`导出工作环境，而不是手动记录依赖
- 考虑使用mamba（conda的快速替代品）：`conda install -c conda-forge mamba`

### 4. Conda与pip混用
- 优先使用conda安装包
- 必要时再用pip，但尽量避免在conda环境中频繁切换包管理器
- 若使用了pip，导出环境时使用`pip freeze`而不是`conda env export`

## 六、最佳实践

1. **为每个项目创建独立环境**，避免依赖冲突
2. **及时备份环境**：`conda env export > environment.yml`
3. **使用环境文件**进行团队协作，确保环境一致性
4. **定期清理**不用的环境和缓存
5. **优先使用conda-forge频道**，它通常有更新的包版本

## 七、常用命令速查表

| 功能 | 命令 |
|------|------|
| 查看conda版本 | `conda --version` |
| 更新conda | `conda update conda` |
| 创建环境 | `conda create -n env_name python=x.x` |
| 激活环境 | `conda activate env_name` |
| 退出环境 | `conda deactivate` |
| 安装包 | `conda install package_name` |
| 安装特定版本 | `conda install package_name=x.x` |
| 导出环境 | `conda env export > environment.yml` |
| 从文件创建环境 | `conda env create -f environment.yml` |
| 删除环境 | `conda env remove -n env_name` |

希望这份指南对您有所帮助！Conda是管理Python环境的强大工具，熟练掌握它将大大提高您的开发效率。
