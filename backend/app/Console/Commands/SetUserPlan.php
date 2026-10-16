<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('user:plan {email : Email address of the user} {plan : Either "free" or "pro"}')]
#[Description('Set a user\'s subscription plan without going through billing.')]
class SetUserPlan extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = (string) $this->argument('email');
        $plan = (string) $this->argument('plan');

        if (! in_array($plan, [User::PLAN_FREE, User::PLAN_PRO], true)) {
            $this->error("Invalid plan [{$plan}]. Allowed values: free, pro.");

            return self::FAILURE;
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("No user found with email [{$email}].");

            return self::FAILURE;
        }

        $user->update(['plan' => $plan]);

        $this->info("{$user->name} <{$user->email}> is now on the {$plan} plan.");

        return self::SUCCESS;
    }
}
