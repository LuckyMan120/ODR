

<template>
  <div class="wrapper pre-auth">
    <div class="page-wrapper">
      <div class="middle-box">
        <h1 class="logo-name">
          <NuxtLink to="/">
            <img
              alt="logo"
              src="~/assets/images/logo-big.png"
              :aria-description="siteName"
            >
          </NuxtLink>
        </h1>
        <nuxt-child />
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  computed: mapGetters({
    siteName: 'site/name'
  })
};

</script>

<style lang="scss" scoped>

@import "@/assets/style/modules/colors";
@import "@/assets/style/modules/media";

.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-wrapper {
  display: flex;
  margin: 0;
  overflow: auto;
  flex: 1 0 auto;
  justify-content: center;
  align-items: center;
  background-color: $color_secondary;
  .middle-box {
    background: $white;
    width: 100% !important;
    max-width: 450px !important;
    padding-top: 0;
    .logo-name {
      font-size: 1em;
      background: $color_primary;
      text-align: center;
      > img {
        padding: 33px 0;
        max-width: 300px;
        width: 80%;
        display: inline-block;
      }
      &.pre-auth{
        text-align: initial;
        display: flex;
        justify-content: space-between;
        padding: 0px 20px;
        align-items: center;
        margin: 0px;
        img{
          padding: 33px 0;
          max-width: 150px;
          margin-right: 5px;
          @media #{$sm-screen} {
            max-width: 130px;
          }
        }
        >.site-name{
          font-size: 14px;
          color: $color_background;
          margin: 0px;
          text-align: right;
          font-weight: 600;
        }
      }
    }
  }
}

.wrapper {
  &.pre-auth{
    .page-wrapper {
      .middle-box {
        .logo-name {
            text-align: initial;
            display: flex;
            justify-content: space-between;
            padding: 0px 20px;
            align-items: center;
            margin: 0px;
            img{
              padding: 33px 0;
              max-width: 150px;
              margin-right: 5px;
              @media #{$sm-screen} {
                max-width: 130px;
              }
            }
          }
      }
    }
  }
}

</style>

