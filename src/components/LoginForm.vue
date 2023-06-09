<template>
    <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="login_show_alert" :class="login_alert_variant">
        {{ login_alert_msg }}
    </div>
    <vee-form @submit="login" :validation-schema="loginSchema">
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <vee-field name="email" type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('register.enter_email')" />
            <error-message name="email" class="text-red-600" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t("register.password") }}</label>
            <vee-field name="password" type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('register.password')" />
            <error-message name="password" class="text-red-600" />
        </div>
        <button type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            :disabled="login_in_submission">
            {{ $t("register.submit") }}
        </button>
    </vee-form>
</template>

<script>
import { ErrorMessage } from "vee-validate"
import { mapActions } from "pinia"
import useUserStore from "@/stores/user"

export default {
    name: 'LoginForm',
    data() {
        return {
            loginSchema: {
                email: "required|email",
                password: "required|min:9|max:32",
            },
            login_in_submission: false,
            login_show_alert: false,
            login_alert_variant: "bg-blue-500",
            login_alert_msg: "Please wait!",
        }
    },
    methods: {
        ...mapActions(useUserStore, ["authenticate"]),
        async login(values) {
            this.login_in_submission = this.login_show_alert = true
            this.login_alert_variant = "bg-blue-500"
            this.login_alert_msg = "Please wait! We are logging you in."

            try {
                await this.authenticate(values)
            } catch (err) {
                this.login_in_submission = false
                this.login_alert_variant = "bg-red-500"
                this.login_alert_msg = "Invalid login details."
                return
            }

            this.login_alert_variant = "bg-green-500"
            this.login_alert_msg = "Success! You are now logged in."
            window.location.reload()
        }
    },
    components: { ErrorMessage }
}
</script>