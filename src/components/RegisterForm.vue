<template>
    <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="reg_show_alert" :class="reg_alert_variant">
        {{ reg_alert_msg }}
    </div>
    <vee-form @submit="register" :validation-schema="schema" :initial-values="userData">
        <!-- Name -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t("register.name") }}</label>
            <vee-field name="name" type="text"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('register.enter_name')" />
            <error-message class="text-red-600" name="name" />
        </div>
        <!-- Listener/Artist -->
        <div class="mb-3">
            <label class="inline-block mb-2">
                {{ $t("register.role") }}
            </label>
            <vee-field name="role" as="select"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
                <option value="artist">{{ $t("register.artist") }}</option>
                <option value="listener">{{ $t("register.listener") }}</option>
                <option value="both">{{ $t("register.both") }}</option>
            </vee-field>
            <error-message class="text-red-600" name="role" />
        </div>
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <vee-field name="email" type="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('register.enter_email')" />
            <error-message class="text-red-600" name="email" />
        </div>
        <!-- Age -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t("register.age") }}</label>
            <vee-field name="age" type="number"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" />
            <error-message class="text-red-600" name="age" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t("register.password") }}</label>
            <vee-field name="password" v-slot="{ field, errors }" :bails="false">
                <input type="password"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    :placeholder="$t('register.password')" v-bind="field" />
                <div class="text-red-600" v-for="error in errors" :key="error">
                    {{ error }}
                </div>
            </vee-field>
        </div>
        <!-- Confirm Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t("register.confirm") }}</label>
            <vee-field name="confirm_password" type="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                :placeholder="$t('register.confirm_password')" />
            <error-message class="text-red-600" name="confirm_password" />
        </div>
        <!-- Country -->
        <div class="mb-3">
            <label class="inline-block mb-2">{{ $t("register.country") }}</label>
            <vee-field as="select" name="country"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
                <option value="USA">{{ $t("register.usa") }}</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">{{ $t("register.germany") }}</option>
                <option value="Brazil">{{ $t("register.brazil") }}</option>
            </vee-field>
            <error-message class="text-red-600" name="country" />
        </div>
        <!-- TOS -->
        <div class="mb-3 pl-6">
            <vee-field name="tos" type="checkbox" value="1" class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
            <i18n-t class="inline-block" keypath="register.accept" tag="label">
                <a href="#">{{ $t("register.tos") }}</a>
            </i18n-t>
            <error-message class="text-red-600" name="tos" />
        </div>
        <button type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            :disabled="reg_in_submission">
            {{ $t("register.submit") }}
        </button>
    </vee-form>
</template>

<script>
import { ErrorMessage } from "vee-validate"

import { mapActions } from "pinia"
import useUserStore from "@/stores/user"

export default {
    name: "RegisterForm",
    data() {
        return {
            schema: {
                name: "required|min:3|max:32|alpha_spaces",
                role: "required",
                email: "required|min:1|max:40|email",
                age: "required|min_value:18|max_value:100",
                password: "required|min:9|max:32|excluded:password",
                confirm_password: "passwords_mismatch:@password",
                country: "required",
                tos: "tos"
            },
            userData: {
                country: "USA"
            },
            reg_in_submission: false,
            reg_show_alert: false,
            reg_alert_variant: "bg-blue-500",
            reg_alert_msg: "Please wait! Your account is being created.",
        }
    },
    methods: {
        ...mapActions(useUserStore, {
            createUser: "register"
        }),

        async register(values) {
            this.reg_in_submission = this.reg_show_alert = true
            this.reg_alert_variant = "bg-blue-500"
            this.reg_alert_msg = "Please wait! Your account is being created."

            try {
                // Chama a ACTION para criar o usuário
                await this.createUser(values)
            } catch (err) {
                // Caso algo de errado, exibe a mensagem de erro. O return no final é importante, para evitar a mensagem de sucesso.
                this.reg_in_submission = false
                this.reg_alert_variant = "bg-red-500"
                this.reg_alert_msg = "An unexpected error occurred. Please try again later."
                return
            }

            this.reg_alert_variant = "bg-green-500"
            this.reg_alert_msg = "Success! Your account has been created."
            window.location.reload()
        },
    },
    components: { ErrorMessage }
}
</script>