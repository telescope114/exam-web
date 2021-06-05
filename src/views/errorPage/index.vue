<template>
    <div class="error-page">
        <el-card>
            <div slot="header">
                <iframe name="weather_inc"
                    src="http://i.tianqi.com/?c=code&id=1"
                    width="330"
                    height="35"
                    frameborder="0"
                    marginwidth="0"
                    marginheight="0"
                    scrolling="no"></iframe>"
            </div>
            <div class="main">
                <h1>资源不存在,俺也没办法......</h1>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "ErrorPageIndex"
    }
</script>

<style lang="scss" scoped>
h1 {
    font-size: 40px;
    text-align: center;
}
.main {
    height: 60vh;
}
</style>
