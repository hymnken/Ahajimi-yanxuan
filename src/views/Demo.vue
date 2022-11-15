<template>
  <div>
    <div class="dialog">
      <div class="dialog-title">标题</div>
      <div class="dialog-content">内容</div>
    </div>
    <div class="box"></div>
    <div class="box2"></div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
$color: #f00;
@mixin wh ($w: 100px, $h: 100px) {
  width: $w;
  height: $h;
}
.dialog {
  // width: 200px;
  // height: 200px;
  @include wh();
  background-color: $colorB;
  &-title {
    color: #fff;
  }
}
.box {
  @include wh(300px, 300px);
  background-color: $color;
}

@function style($arg){
    @if($arg == 1) {
        @return #000;
    }
    @else if($arg == 2){
        @return #fff;
    }
    @else{
        @return #ccc;
    }
}
.box2{
    background-color: style(2);
}
</style>
